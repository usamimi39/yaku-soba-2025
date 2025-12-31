import type p5 from 'p5'

interface Bar {
  x: number
  y: number
  width: number
  height: number
  velocity: number // 落下速度
}

const sketch = (p: p5) => {
  const bars: Bar[] = []
  let lastBarTime = 0
  const BAR_INTERVAL = 10 // 1秒に一回
  const BAR_WIDTH = 10
  const BAR_HEIGHT_MIN = 100
  const BAR_HEIGHT_MAX = 400
  const CENTER_RANGE = 300 // 画面の横の中央の300px分の範囲
  const GRAVITY = 0.3 // 重力加速度（ピクセル/フレーム^2）
  const INITIAL_Y_OFFSET = -400 // 上の縦-400pxの位置から落下
  let isPaused = false // 一時停止状態
  let pausedCount = 0 // 一時停止時の棒の数
  let redBarY = 0 // 赤い棒のY座標
  let redBarX = 0 // 赤い棒の現在のX座標
  let isAnimating = false // アニメーション中かどうか
  let showNumber = false // 数字を表示するかどうか
  const RED_BAR_HEIGHT = 300 // 赤い棒の高さ
  const RED_BAR_WIDTH = 10 // 赤い棒の幅
  const ANIMATION_SPEED = 30 // 赤い棒の移動速度（ピクセル/フレーム）

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(220)

    if (!isPaused) {
      // 1秒に一回、新しい棒を生成
      const currentTime = p.millis()
      if (currentTime - lastBarTime >= BAR_INTERVAL) {
        // 画面の横の中央の300px分の範囲にランダムに配置
        const centerX = p.width / 2
        const rangeStart = centerX - CENTER_RANGE / 2
        const rangeEnd = centerX + CENTER_RANGE / 2
        const x = p.random(rangeStart, rangeEnd)

        // 高さは100-400pxの範囲でランダム
        const height = p.random(BAR_HEIGHT_MIN, BAR_HEIGHT_MAX)

        bars.push({
          x: x,
          y: INITIAL_Y_OFFSET,
          width: BAR_WIDTH,
          height: height,
          velocity: 0
        })

        lastBarTime = currentTime
      }

      // 棒を更新して描画
      for (let i = bars.length - 1; i >= 0; i--) {
        const bar = bars[i]

        // 物理的な加速度を適用
        bar.velocity += GRAVITY
        bar.y += bar.velocity

        // 画面外に出たら削除
        if (bar.y > p.height) {
          bars.splice(i, 1)
          continue
        }
      }
    }

    // 棒を描画（一時停止中でも表示）
    for (const bar of bars) {
      p.fill(128)
      p.noStroke()
      p.rect(bar.x, bar.y, bar.width, bar.height)
    }

    // 一時停止中は大きく数字を表示
    if (isPaused) {
      p.fill(255, 0, 0)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(120)
      p.text(pausedCount.toString(), p.width / 2, p.height / 2)
    }
  }

  // あるy座標の位置に何個の灰色の棒がかかっているかを計算する関数
  const countBarsAtY = (y: number): number => {
    let count = 0
    for (const bar of bars) {
      // 棒のy座標範囲に指定されたy座標が含まれているかチェック
      if (y >= bar.y && y <= bar.y + bar.height) {
        count++
      }
    }
    return count
  }

  // クリック時の機能
  p.mousePressed = () => {
    const y = p.mouseY
    const count = countBarsAtY(y)

    // 一時停止状態を切り替え
    isPaused = !isPaused

    if (isPaused) {
      // 一時停止時、クリックした位置の棒の数を記録
      pausedCount = count
      console.log(`一時停止: y座標${y}にかかっている棒の数: ${count}`)
    } else {
      console.log('再開')
    }

    return false
  }

  // ウィンドウサイズ変更時にキャンバスをリサイズ
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

export default sketch