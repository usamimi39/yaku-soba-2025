module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
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
"[project]/src/sketches/sampleSketch.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
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
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d712b378._.js.map