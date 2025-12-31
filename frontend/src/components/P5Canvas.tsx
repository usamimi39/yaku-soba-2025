"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

interface P5CanvasProps {
  sketch: (p: p5) => void;
  className?: string;
}

/**
 * P5Canvas Component
 *
 * p5.jsスケッチをReactコンポーネントとして描画します。
 * 外部のp5プロジェクトを後から統合しやすいように設計されています。
 *
 * @param sketch - p5スケッチ関数（setup, draw等を定義）
 * @param className - 追加のCSSクラス名（オプション）
 */
export default function P5Canvas({ sketch, className = "" }: P5CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    // p5を動的にインポートしてSSRエラーを回避
    import("p5").then((p5Module) => {
      const p5Constructor = p5Module.default;

      // p5インスタンスの初期化
      if (canvasRef.current && !p5Instance.current) {
        p5Instance.current = new p5Constructor(sketch, canvasRef.current);
      }
    });

    // クリーンアップ: コンポーネントのアンマウント時にp5インスタンスを破棄
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [sketch]);

  return <div ref={canvasRef} className={className} />;
}
