import p5 from 'p5';

/**
 * サンプルスケッチ: シンプルな円の描画
 * 
 * 外部のp5プロジェクトを統合する際は、
 * このファイルと同様の形式でスケッチ関数をエクスポートしてください。
 */
export const sampleSketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(220);
    p.fill(255, 0, 0);
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };
};
