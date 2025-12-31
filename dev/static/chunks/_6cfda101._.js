(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/P5Canvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>P5Canvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function P5Canvas({ sketch, className = "" }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const p5Instance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "P5Canvas.useEffect": ()=>{
            // p5を動的にインポートしてSSRエラーを回避
            __turbopack_context__.A("[project]/node_modules/p5/dist/app.js [app-client] (ecmascript, async loader)").then({
                "P5Canvas.useEffect": (p5Module)=>{
                    const p5Constructor = p5Module.default;
                    // p5インスタンスの初期化
                    if (canvasRef.current && !p5Instance.current) {
                        p5Instance.current = new p5Constructor(sketch, canvasRef.current);
                    }
                }
            }["P5Canvas.useEffect"]);
            // クリーンアップ: コンポーネントのアンマウント時にp5インスタンスを破棄
            return ({
                "P5Canvas.useEffect": ()=>{
                    if (p5Instance.current) {
                        p5Instance.current.remove();
                        p5Instance.current = null;
                    }
                }
            })["P5Canvas.useEffect"];
        }
    }["P5Canvas.useEffect"], [
        sketch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: canvasRef,
        className: className
    }, void 0, false, {
        fileName: "[project]/src/components/P5Canvas.tsx",
        lineNumber: 44,
        columnNumber: 10
    }, this);
}
_s(P5Canvas, "j7dp+dAHmhKlrpSnJSVVHC1Vyg8=");
_c = P5Canvas;
var _c;
__turbopack_context__.k.register(_c, "P5Canvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/handDetector.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/sketches/sampleSketch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/handDetector.ts [app-client] (ecmascript)");
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
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handSwipeDetector"].start().then(()=>{
            console.log('Hand swipe detector initialized');
        });
        // 左から右へのスワイプ検知時のコールバックを登録
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handSwipeDetector"].onSwipeRight((event)=>{
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
        const debug = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$handDetector$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handSwipeDetector"].debugInfo;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$P5Canvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/P5Canvas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sketches$2f$sampleSketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/sketches/sampleSketch.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-screen h-screen overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$P5Canvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            sketch: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sketches$2f$sampleSketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
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
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_6cfda101._.js.map