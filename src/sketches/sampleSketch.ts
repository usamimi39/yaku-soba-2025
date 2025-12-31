import type p5 from 'p5'
import { handSwipeDetector, type SwipeEvent } from '@/lib/handDetector'

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
  const RED_BAR_HEIGHT = 10 // 赤い棒の高さ
  const RED_BAR_WIDTH = 300 // 赤い棒の幅
  const ANIMATION_SPEED = 30 // 赤い棒の移動速度（ピクセル/フレーム）

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)

    // 手の左右スワイプ検知を開始
    handSwipeDetector.start().then(() => {
      console.log('Hand swipe detector initialized')
    })

    // 左から右へのスワイプ検知時のコールバックを登録
    handSwipeDetector.onSwipeRight((event: SwipeEvent) => {
      handleSwipeRight(event)
    })
  }

  // 手の左から右スワイプ時の処理（クリックと同じキルモーション）
  const handleSwipeRight = (event: SwipeEvent) => {
    if (showNumber) {
      // すでに数字が表示されている場合は、リセットして再開
      showNumber = false
      isPaused = false
      console.log('再開（手のスワイプ）')
    } else {
      // Y座標を画面座標に変換
      const screenY = event.palmY * p.height

      // スワイプ位置にかかっている棒の数を計算
      const count = countBarsAtY(screenY)

      // 棒を停止
      isPaused = true
      pausedCount = count

      // 赤い棒の初期位置を設定（左端、手の位置のY座標）
      redBarX = 0
      redBarY = screenY - RED_BAR_HEIGHT / 2

      // アニメーション開始
      isAnimating = true

      console.log(`手のスワイプ: y座標${Math.round(screenY)}にかかっている棒の数: ${count}`)
    }
  }

  p.draw = () => {
    p.background(220)

    if (!isPaused && !isAnimating) {
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

    // 赤い棒のアニメーション
    if (isAnimating) {
      // 赤い棒を左から右に移動
      redBarX += ANIMATION_SPEED

      // 赤い棒を描画
      p.fill(255, 0, 0)
      p.noStroke()
      p.rect(redBarX, redBarY, RED_BAR_WIDTH, RED_BAR_HEIGHT)

      // 画面の右端に到達したらアニメーション終了
      if (redBarX >= p.width) {
        isAnimating = false
        showNumber = true
      }
    }

    // 数字を表示
    if (showNumber) {
      p.fill(255, 0, 0)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(120)
      p.text(pausedCount.toString(), p.width / 2, p.height / 2)
    }

    // デバッグ: 手の検知状態を表示
    drawHandDebugInfo()
  }

  // デバッグ: 手の検知状態を画面に表示
  const drawHandDebugInfo = () => {
    const debug = handSwipeDetector.debugInfo

    // 背景ボックス
    p.fill(0, 0, 0, 150)
    p.noStroke()
    p.rect(10, 10, 280, 120, 5)

    // テキスト
    p.fill(255)
    p.textAlign(p.LEFT, p.TOP)
    p.textSize(14)
    p.text(`カメラ: ${debug.isDetecting ? '検出中 📷' : '未開始'}`, 20, 20)
    p.text(`手の状態: ${debug.isOpenHand ? 'パー ✋' : '検出なし'}`, 20, 40)
    p.text(`Y位置: ${(debug.palmY * 100).toFixed(1)}%`, 20, 60)
    p.text(`X位置: ${(debug.palmX * 100).toFixed(1)}%`, 20, 80)
    p.text(`指: ${debug.fingerStates.map((s) => (s ? '◯' : '×')).join(' ')}`, 20, 100)

    // 手の位置を示すインジケーター
    if (debug.isOpenHand) {
      // カメラは鏡像なのでX座標を反転
      const indicatorX = (1 - debug.palmX) * p.width
      const indicatorY = debug.palmY * p.height
      p.fill(0, 255, 0, 150)
      p.noStroke()
      p.ellipse(indicatorX, indicatorY, 60, 60)
      p.fill(255)
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(24)
      p.text('✋', indicatorX, indicatorY)
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
    if (showNumber) {
      // すでに数字が表示されている場合は、リセットして再開
      showNumber = false
      isPaused = false
      console.log('再開')
    } else {
      // アニメーションを開始
      const y = p.mouseY
      const count = countBarsAtY(y)

      // 棒を停止
      isPaused = true
      pausedCount = count

      // 赤い棒の初期位置を設定（左端、クリックしたY座標の中心から上に150px）
      redBarX = 0
      redBarY = y - RED_BAR_HEIGHT / 2

      // アニメーション開始
      isAnimating = true

      console.log(`クリック: y座標${y}にかかっている棒の数: ${count}`)
    }

    return false
  }

  // ウィンドウサイズ変更時にキャンバスをリサイズ
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

export default sketch