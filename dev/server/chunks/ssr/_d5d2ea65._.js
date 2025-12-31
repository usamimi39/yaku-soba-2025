module.exports = [
"[project]/src/components/P5Canvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>P5Canvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function P5Canvas({ sketch, className = "" }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const p5Instance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // p5を動的にインポートしてSSRエラーを回避
        __turbopack_context__.A("[project]/node_modules/p5/dist/app.js [app-ssr] (ecmascript, async loader)").then((p5Module)=>{
            const p5Constructor = p5Module.default;
            // p5インスタンスの初期化
            if (canvasRef.current && !p5Instance.current) {
                p5Instance.current = new p5Constructor(sketch, canvasRef.current);
            }
        });
        // クリーンアップ: コンポーネントのアンマウント時にp5インスタンスを破棄
        return ()=>{
            if (p5Instance.current) {
                p5Instance.current.remove();
                p5Instance.current = null;
            }
        };
    }, [
        sketch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: canvasRef,
        className: className
    }, void 0, false, {
        fileName: "[project]/src/components/P5Canvas.tsx",
        lineNumber: 44,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/lib/handDetector.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 手の左から右へのスワイプ動作を検知するモジュール
 * MediaPipe Handsを使用してカメラから手を検出し、
 * パーの状態で左から右に振る動作を検知します
 */ // MediaPipe Handsの型定義
__turbopack_context__.s([
    "HandSwipeDetector",
    ()=>HandSwipeDetector,
    "getHandSwipeDetector",
    ()=>getHandSwipeDetector,
    "handSwipeDetector",
    ()=>handSwipeDetector
]);
class HandSwipeDetector {
    hands = null;
    camera = null;
    videoElement = null;
    isRunning = false;
    swipeCallbacks = [];
    // 手の状態履歴
    handStateHistory = [];
    MAX_HISTORY_LENGTH = 30 // 約1秒分（30fps想定）
    ;
    // 設定
    config = {
        minXDelta: 0.15,
        maxTimeMs: 500,
        fingerExtendThreshold: 0.15 // 指が伸びていると判定する閾値
    };
    // デバッグ用
    debugInfo = {
        isOpenHand: false,
        palmY: 0,
        palmX: 0,
        fingerStates: [
            false,
            false,
            false,
            false,
            false
        ],
        isDetecting: false
    };
    constructor(config){
        if (config) {
            this.config = {
                ...this.config,
                ...config
            };
        }
    }
    /**
   * 手の検知を初期化して開始
   */ async start() {
        if (this.isRunning) return;
        // グローバルにMediaPipeがロードされているか確認
        const globalWindow = window;
        if (!globalWindow.Hands || !globalWindow.Camera) {
            console.error('MediaPipe not loaded. Please include the MediaPipe scripts.');
            return;
        }
        // video要素を作成
        this.videoElement = document.createElement('video');
        this.videoElement.style.display = 'none';
        document.body.appendChild(this.videoElement);
        // MediaPipe Handsを初期化
        this.hands = new globalWindow.Hands({
            locateFile: (file)=>{
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });
        this.hands.onResults((results)=>this.processResults(results));
        // カメラを開始
        this.camera = new globalWindow.Camera(this.videoElement, {
            onFrame: async ()=>{
                if (this.hands && this.videoElement) {
                    await this.hands.send({
                        image: this.videoElement
                    });
                }
            },
            width: 640,
            height: 480
        });
        this.camera.start();
        this.isRunning = true;
        this.debugInfo.isDetecting = true;
        console.log('Hand detection started');
    }
    /**
   * 手の検知を停止
   */ stop() {
        if (this.camera) {
            this.camera.stop();
        }
        if (this.videoElement && this.videoElement.parentNode) {
            this.videoElement.parentNode.removeChild(this.videoElement);
            this.videoElement = null;
        }
        this.isRunning = false;
        this.debugInfo.isDetecting = false;
        console.log('Hand detection stopped');
    }
    /**
   * 左から右へのスワイプ検知時のコールバックを登録
   */ onSwipeRight(callback) {
        this.swipeCallbacks.push(callback);
    }
    /**
   * コールバックをクリア
   */ clearCallbacks() {
        this.swipeCallbacks = [];
    }
    /**
   * MediaPipeの結果を処理
   */ processResults(results) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            // 手が検出されていない場合、履歴をクリア
            this.handStateHistory = [];
            this.debugInfo.isOpenHand = false;
            return;
        }
        const landmarks = results.multiHandLandmarks[0];
        const isOpenHand = this.checkOpenHand(landmarks);
        const palmY = this.getPalmY(landmarks);
        const palmX = this.getPalmX(landmarks);
        const currentState = {
            isOpenHand,
            palmY,
            palmX,
            timestamp: Date.now()
        };
        // デバッグ情報を更新
        this.debugInfo.isOpenHand = isOpenHand;
        this.debugInfo.palmY = palmY;
        this.debugInfo.palmX = palmX;
        // 履歴に追加
        this.handStateHistory.push(currentState);
        // 履歴の長さを制限
        if (this.handStateHistory.length > this.MAX_HISTORY_LENGTH) {
            this.handStateHistory.shift();
        }
        // 左から右へのスワイプを検知
        this.detectSwipeRight();
    }
    /**
   * 手がパー（開いた状態）かどうかをチェック
   * すべての指が伸びているかどうかで判定
   */ checkOpenHand(landmarks) {
        // MediaPipe Handsのランドマークインデックス:
        // 0: 手首
        // 1-4: 親指 (1: CMC, 2: MCP, 3: IP, 4: TIP)
        // 5-8: 人差し指 (5: MCP, 6: PIP, 7: DIP, 8: TIP)
        // 9-12: 中指 (9: MCP, 10: PIP, 11: DIP, 12: TIP)
        // 13-16: 薬指 (13: MCP, 14: PIP, 15: DIP, 16: TIP)
        // 17-20: 小指 (17: MCP, 18: PIP, 19: DIP, 20: TIP)
        const fingerTips = [
            8,
            12,
            16,
            20
        ] // 人差し指から小指の先端
        ;
        const fingerPIPs = [
            6,
            10,
            14,
            18
        ] // 人差し指から小指の第二関節
        ;
        let extendedFingers = 0;
        const fingerStates = [];
        // 親指のチェック（横に開いているかどうか）
        const thumbExtended = Math.abs(landmarks[4].x - landmarks[2].x) > this.config.fingerExtendThreshold;
        fingerStates.push(thumbExtended);
        if (thumbExtended) extendedFingers++;
        // 他の4本の指をチェック（指先が第二関節より上にあるか）
        for(let i = 0; i < 4; i++){
            const isExtended = landmarks[fingerTips[i]].y < landmarks[fingerPIPs[i]].y;
            fingerStates.push(isExtended);
            if (isExtended) extendedFingers++;
        }
        this.debugInfo.fingerStates = fingerStates;
        // 4本以上の指が伸びていればパー
        return extendedFingers >= 4;
    }
    /**
   * 手のひらのY座標を取得（0が上、1が下）
   */ getPalmY(landmarks) {
        // 手首(0)と中指のMCP(9)の中間点を手のひらの中心とする
        return (landmarks[0].y + landmarks[9].y) / 2;
    }
    /**
   * 手のひらのX座標を取得（0が左、1が右）
   */ getPalmX(landmarks) {
        return (landmarks[0].x + landmarks[9].x) / 2;
    }
    /**
   * 左から右へのスワイプ動作を検知
   * カメラは鏡像なので、実際には画面上でX座標が減少する方向
   */ detectSwipeRight() {
        if (this.handStateHistory.length < 5) return;
        const now = Date.now();
        const recentHistory = this.handStateHistory.filter((state)=>now - state.timestamp <= this.config.maxTimeMs && state.isOpenHand);
        if (recentHistory.length < 3) return;
        // 最初と最後の状態を比較
        const firstState = recentHistory[0];
        const lastState = recentHistory[recentHistory.length - 1];
        // X座標の変化量（カメラは鏡像なので、負の値 = 実際には右方向への移動）
        const xDelta = firstState.palmX - lastState.palmX;
        // 左から右へのスワイプを検知
        if (xDelta >= this.config.minXDelta) {
            const event = {
                startX: firstState.palmX,
                endX: lastState.palmX,
                palmY: lastState.palmY,
                duration: lastState.timestamp - firstState.timestamp
            };
            console.log('Swipe right detected!', event);
            // 履歴をクリア（連続検知を防ぐ）
            this.handStateHistory = [];
            // コールバックを実行
            this.swipeCallbacks.forEach((callback)=>callback(event));
        }
    }
    /**
   * 検知器が動作中かどうか
   */ isActive() {
        return this.isRunning;
    }
}
// シングルトンインスタンス
let instance = null;
const getHandSwipeDetector = (config)=>{
    if (!instance) {
        instance = new HandSwipeDetector(config);
    }
    return instance;
};
const handSwipeDetector = new HandSwipeDetector();
}),
"[project]/src/sketches/sampleSketch.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/handDetector.ts [app-ssr] (ecmascript)");
;
const sketch = (p)=>{
    const bars = [];
    let lastBarTime = 0;
    const BAR_INTERVAL = 10 // 1秒に一回
    ;
    const BAR_WIDTH = 10;
    const BAR_HEIGHT_MIN = 100;
    const BAR_HEIGHT_MAX = 400;
    const CENTER_RANGE = 300 // 画面の横の中央の300px分の範囲
    ;
    const GRAVITY = 0.3 // 重力加速度（ピクセル/フレーム^2）
    ;
    const INITIAL_Y_OFFSET = -400 // 上の縦-400pxの位置から落下
    ;
    let isPaused = false // 一時停止状態
    ;
    let pausedCount = 0 // 一時停止時の棒の数
    ;
    let redBarY = 0 // 赤い棒のY座標
    ;
    let redBarX = 0 // 赤い棒の現在のX座標
    ;
    let isAnimating = false // アニメーション中かどうか
    ;
    let showNumber = false // 数字を表示するかどうか
    ;
    const RED_BAR_HEIGHT = 10 // 赤い棒の高さ
    ;
    const RED_BAR_WIDTH = 300 // 赤い棒の幅
    ;
    const ANIMATION_SPEED = 30 // 赤い棒の移動速度（ピクセル/フレーム）
    ;
    p.setup = ()=>{
        p.createCanvas(p.windowWidth, p.windowHeight);
        // 手の左右スワイプ検知を開始
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handSwipeDetector"].start().then(()=>{
            console.log('Hand swipe detector initialized');
        });
        // 左から右へのスワイプ検知時のコールバックを登録
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handSwipeDetector"].onSwipeRight((event)=>{
            handleSwipeRight(event);
        });
    };
    // 手の左から右スワイプ時の処理（クリックと同じキルモーション）
    const handleSwipeRight = (event)=>{
        if (showNumber) {
            // すでに数字が表示されている場合は、リセットして再開
            showNumber = false;
            isPaused = false;
            console.log('再開（手のスワイプ）');
        } else {
            // Y座標を画面座標に変換
            const screenY = event.palmY * p.height;
            // スワイプ位置にかかっている棒の数を計算
            const count = countBarsAtY(screenY);
            // 棒を停止
            isPaused = true;
            pausedCount = count;
            // 赤い棒の初期位置を設定（左端、手の位置のY座標）
            redBarX = 0;
            redBarY = screenY - RED_BAR_HEIGHT / 2;
            // アニメーション開始
            isAnimating = true;
            console.log(`手のスワイプ: y座標${Math.round(screenY)}にかかっている棒の数: ${count}`);
        }
    };
    p.draw = ()=>{
        p.background(220);
        if (!isPaused && !isAnimating) {
            // 1秒に一回、新しい棒を生成
            const currentTime = p.millis();
            if (currentTime - lastBarTime >= BAR_INTERVAL) {
                // 画面の横の中央の300px分の範囲にランダムに配置
                const centerX = p.width / 2;
                const rangeStart = centerX - CENTER_RANGE / 2;
                const rangeEnd = centerX + CENTER_RANGE / 2;
                const x = p.random(rangeStart, rangeEnd);
                // 高さは100-400pxの範囲でランダム
                const height = p.random(BAR_HEIGHT_MIN, BAR_HEIGHT_MAX);
                bars.push({
                    x: x,
                    y: INITIAL_Y_OFFSET,
                    width: BAR_WIDTH,
                    height: height,
                    velocity: 0
                });
                lastBarTime = currentTime;
            }
            // 棒を更新して描画
            for(let i = bars.length - 1; i >= 0; i--){
                const bar = bars[i];
                // 物理的な加速度を適用
                bar.velocity += GRAVITY;
                bar.y += bar.velocity;
                // 画面外に出たら削除
                if (bar.y > p.height) {
                    bars.splice(i, 1);
                    continue;
                }
            }
        }
        // 棒を描画（一時停止中でも表示）
        for (const bar of bars){
            p.fill(128);
            p.noStroke();
            p.rect(bar.x, bar.y, bar.width, bar.height);
        }
        // 赤い棒のアニメーション
        if (isAnimating) {
            // 赤い棒を左から右に移動
            redBarX += ANIMATION_SPEED;
            // 赤い棒を描画
            p.fill(255, 0, 0);
            p.noStroke();
            p.rect(redBarX, redBarY, RED_BAR_WIDTH, RED_BAR_HEIGHT);
            // 画面の右端に到達したらアニメーション終了
            if (redBarX >= p.width) {
                isAnimating = false;
                showNumber = true;
            }
        }
        // 数字を表示
        if (showNumber) {
            p.fill(255, 0, 0);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(120);
            p.text(pausedCount.toString(), p.width / 2, p.height / 2);
        }
        // デバッグ: 手の検知状態を表示
        drawHandDebugInfo();
    };
    // デバッグ: 手の検知状態を画面に表示
    const drawHandDebugInfo = ()=>{
        const debug = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handSwipeDetector"].debugInfo;
        // 背景ボックス
        p.fill(0, 0, 0, 150);
        p.noStroke();
        p.rect(10, 10, 280, 120, 5);
        // テキスト
        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(14);
        p.text(`カメラ: ${debug.isDetecting ? '検出中 📷' : '未開始'}`, 20, 20);
        p.text(`手の状態: ${debug.isOpenHand ? 'パー ✋' : '検出なし'}`, 20, 40);
        p.text(`Y位置: ${(debug.palmY * 100).toFixed(1)}%`, 20, 60);
        p.text(`X位置: ${(debug.palmX * 100).toFixed(1)}%`, 20, 80);
        p.text(`指: ${debug.fingerStates.map((s)=>s ? '◯' : '×').join(' ')}`, 20, 100);
        // 手の位置を示すインジケーター
        if (debug.isOpenHand) {
            // カメラは鏡像なのでX座標を反転
            const indicatorX = (1 - debug.palmX) * p.width;
            const indicatorY = debug.palmY * p.height;
            p.fill(0, 255, 0, 150);
            p.noStroke();
            p.ellipse(indicatorX, indicatorY, 60, 60);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(24);
            p.text('✋', indicatorX, indicatorY);
        }
    };
    // あるy座標の位置に何個の灰色の棒がかかっているかを計算する関数
    const countBarsAtY = (y)=>{
        let count = 0;
        for (const bar of bars){
            // 棒のy座標範囲に指定されたy座標が含まれているかチェック
            if (y >= bar.y && y <= bar.y + bar.height) {
                count++;
            }
        }
        return count;
    };
    // クリック時の機能
    p.mousePressed = ()=>{
        if (showNumber) {
            // すでに数字が表示されている場合は、リセットして再開
            showNumber = false;
            isPaused = false;
            console.log('再開');
        } else {
            // アニメーションを開始
            const y = p.mouseY;
            const count = countBarsAtY(y);
            // 棒を停止
            isPaused = true;
            pausedCount = count;
            // 赤い棒の初期位置を設定（左端、クリックしたY座標の中心から上に150px）
            redBarX = 0;
            redBarY = y - RED_BAR_HEIGHT / 2;
            // アニメーション開始
            isAnimating = true;
            console.log(`クリック: y座標${y}にかかっている棒の数: ${count}`);
        }
        return false;
    };
    // ウィンドウサイズ変更時にキャンバスをリサイズ
    p.windowResized = ()=>{
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
const __TURBOPACK__default__export__ = sketch;
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$P5Canvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/P5Canvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sketches$2f$sampleSketch$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/sketches/sampleSketch.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-screen h-screen overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$P5Canvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            sketch: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sketches$2f$sampleSketch$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
            className: "w-full h-full"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_d5d2ea65._.js.map