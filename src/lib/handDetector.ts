/**
 * 手の左から右へのスワイプ動作を検知するモジュール
 * MediaPipe Handsを使用してカメラから手を検出し、
 * パーの状態で左から右に振る動作を検知します
 */

// MediaPipe Handsの型定義
interface HandLandmark {
  x: number
  y: number
  z: number
}

interface HandResults {
  multiHandLandmarks?: HandLandmark[][]
  multiHandedness?: { label: string; score: number }[]
}

interface HandsOptions {
  maxNumHands: number
  modelComplexity: number
  minDetectionConfidence: number
  minTrackingConfidence: number
}

interface MediaPipeHands {
  setOptions: (options: HandsOptions) => void
  onResults: (callback: (results: HandResults) => void) => void
  send: (input: { image: HTMLVideoElement }) => Promise<void>
}

interface MediaPipeCamera {
  start: () => void
  stop: () => void
}

// 手の検知状態
interface HandState {
  isOpenHand: boolean // パーの状態かどうか
  palmY: number // 手のひらのY座標（0-1、上が0）
  palmX: number // 手のひらのX座標（0-1、左が0）
  timestamp: number
}

// スワイプジェスチャーの設定
interface SwipeConfig {
  minXDelta: number // 最小の横移動距離（正規化座標）
  maxTimeMs: number // 最大の検知時間（ミリ秒）
  fingerExtendThreshold: number // 指が伸びていると判定する閾値
}

// スワイプ検知イベント
export interface SwipeEvent {
  startX: number
  endX: number
  palmY: number // スワイプ完了時のY座標
  duration: number
}

type SwipeCallback = (event: SwipeEvent) => void

export class HandSwipeDetector {
  private hands: MediaPipeHands | null = null
  private camera: MediaPipeCamera | null = null
  private videoElement: HTMLVideoElement | null = null
  private isRunning = false
  private swipeCallbacks: SwipeCallback[] = []

  // 手の状態履歴
  private handStateHistory: HandState[] = []
  private readonly MAX_HISTORY_LENGTH = 30 // 約1秒分（30fps想定）

  // 設定
  private config: SwipeConfig = {
    minXDelta: 0.15, // 画面の15%以上の横移動
    maxTimeMs: 500, // 500ms以内に完了
    fingerExtendThreshold: 0.15 // 指が伸びていると判定する閾値
  }

  // デバッグ用
  public debugInfo: {
    isOpenHand: boolean
    palmY: number
    palmX: number
    fingerStates: boolean[]
    isDetecting: boolean
  } = {
    isOpenHand: false,
    palmY: 0,
    palmX: 0,
    fingerStates: [false, false, false, false, false],
    isDetecting: false
  }

  constructor(config?: Partial<SwipeConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * 手の検知を初期化して開始
   */
  async start(): Promise<void> {
    if (this.isRunning) return

    // グローバルにMediaPipeがロードされているか確認
    const globalWindow = window as unknown as {
      Hands?: new (config: { locateFile: (file: string) => string }) => MediaPipeHands
      Camera?: new (
        videoElement: HTMLVideoElement,
        config: { onFrame: () => Promise<void>; width: number; height: number }
      ) => MediaPipeCamera
    }

    if (!globalWindow.Hands || !globalWindow.Camera) {
      console.error('MediaPipe not loaded. Please include the MediaPipe scripts.')
      return
    }

    // video要素を作成
    this.videoElement = document.createElement('video')
    this.videoElement.style.display = 'none'
    document.body.appendChild(this.videoElement)

    // MediaPipe Handsを初期化
    this.hands = new globalWindow.Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      }
    })

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    })

    this.hands.onResults((results) => this.processResults(results))

    // カメラを開始
    this.camera = new globalWindow.Camera(this.videoElement, {
      onFrame: async () => {
        if (this.hands && this.videoElement) {
          await this.hands.send({ image: this.videoElement })
        }
      },
      width: 640,
      height: 480
    })

    this.camera.start()
    this.isRunning = true
    this.debugInfo.isDetecting = true
    console.log('Hand detection started')
  }

  /**
   * 手の検知を停止
   */
  stop(): void {
    if (this.camera) {
      this.camera.stop()
    }
    if (this.videoElement && this.videoElement.parentNode) {
      this.videoElement.parentNode.removeChild(this.videoElement)
      this.videoElement = null
    }
    this.isRunning = false
    this.debugInfo.isDetecting = false
    console.log('Hand detection stopped')
  }

  /**
   * 左から右へのスワイプ検知時のコールバックを登録
   */
  onSwipeRight(callback: SwipeCallback): void {
    this.swipeCallbacks.push(callback)
  }

  /**
   * コールバックをクリア
   */
  clearCallbacks(): void {
    this.swipeCallbacks = []
  }

  /**
   * MediaPipeの結果を処理
   */
  private processResults(results: HandResults): void {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      // 手が検出されていない場合、履歴をクリア
      this.handStateHistory = []
      this.debugInfo.isOpenHand = false
      return
    }

    const landmarks = results.multiHandLandmarks[0]
    const isOpenHand = this.checkOpenHand(landmarks)
    const palmY = this.getPalmY(landmarks)
    const palmX = this.getPalmX(landmarks)

    const currentState: HandState = {
      isOpenHand,
      palmY,
      palmX,
      timestamp: Date.now()
    }

    // デバッグ情報を更新
    this.debugInfo.isOpenHand = isOpenHand
    this.debugInfo.palmY = palmY
    this.debugInfo.palmX = palmX

    // 履歴に追加
    this.handStateHistory.push(currentState)

    // 履歴の長さを制限
    if (this.handStateHistory.length > this.MAX_HISTORY_LENGTH) {
      this.handStateHistory.shift()
    }

    // 左から右へのスワイプを検知
    this.detectSwipeRight()
  }

  /**
   * 手がパー（開いた状態）かどうかをチェック
   * すべての指が伸びているかどうかで判定
   */
  private checkOpenHand(landmarks: HandLandmark[]): boolean {
    // MediaPipe Handsのランドマークインデックス:
    // 0: 手首
    // 1-4: 親指 (1: CMC, 2: MCP, 3: IP, 4: TIP)
    // 5-8: 人差し指 (5: MCP, 6: PIP, 7: DIP, 8: TIP)
    // 9-12: 中指 (9: MCP, 10: PIP, 11: DIP, 12: TIP)
    // 13-16: 薬指 (13: MCP, 14: PIP, 15: DIP, 16: TIP)
    // 17-20: 小指 (17: MCP, 18: PIP, 19: DIP, 20: TIP)

    const fingerTips = [8, 12, 16, 20] // 人差し指から小指の先端
    const fingerPIPs = [6, 10, 14, 18] // 人差し指から小指の第二関節

    let extendedFingers = 0
    const fingerStates: boolean[] = []

    // 親指のチェック（横に開いているかどうか）
    const thumbExtended =
      Math.abs(landmarks[4].x - landmarks[2].x) > this.config.fingerExtendThreshold
    fingerStates.push(thumbExtended)
    if (thumbExtended) extendedFingers++

    // 他の4本の指をチェック（指先が第二関節より上にあるか）
    for (let i = 0; i < 4; i++) {
      const isExtended = landmarks[fingerTips[i]].y < landmarks[fingerPIPs[i]].y
      fingerStates.push(isExtended)
      if (isExtended) extendedFingers++
    }

    this.debugInfo.fingerStates = fingerStates

    // 4本以上の指が伸びていればパー
    return extendedFingers >= 4
  }

  /**
   * 手のひらのY座標を取得（0が上、1が下）
   */
  private getPalmY(landmarks: HandLandmark[]): number {
    // 手首(0)と中指のMCP(9)の中間点を手のひらの中心とする
    return (landmarks[0].y + landmarks[9].y) / 2
  }

  /**
   * 手のひらのX座標を取得（0が左、1が右）
   */
  private getPalmX(landmarks: HandLandmark[]): number {
    return (landmarks[0].x + landmarks[9].x) / 2
  }

  /**
   * 左から右へのスワイプ動作を検知
   * カメラは鏡像なので、実際には画面上でX座標が減少する方向
   */
  private detectSwipeRight(): void {
    if (this.handStateHistory.length < 5) return

    const now = Date.now()
    const recentHistory = this.handStateHistory.filter(
      (state) =>
        now - state.timestamp <= this.config.maxTimeMs && state.isOpenHand
    )

    if (recentHistory.length < 3) return

    // 最初と最後の状態を比較
    const firstState = recentHistory[0]
    const lastState = recentHistory[recentHistory.length - 1]

    // X座標の変化量（カメラは鏡像なので、負の値 = 実際には右方向への移動）
    const xDelta = firstState.palmX - lastState.palmX

    // 左から右へのスワイプを検知
    if (xDelta >= this.config.minXDelta) {
      const event: SwipeEvent = {
        startX: firstState.palmX,
        endX: lastState.palmX,
        palmY: lastState.palmY,
        duration: lastState.timestamp - firstState.timestamp
      }

      console.log('Swipe right detected!', event)

      // 履歴をクリア（連続検知を防ぐ）
      this.handStateHistory = []

      // コールバックを実行
      this.swipeCallbacks.forEach((callback) => callback(event))
    }
  }

  /**
   * 検知器が動作中かどうか
   */
  isActive(): boolean {
    return this.isRunning
  }
}

// シングルトンインスタンス
let instance: HandSwipeDetector | null = null

export const getHandSwipeDetector = (config?: Partial<SwipeConfig>): HandSwipeDetector => {
  if (!instance) {
    instance = new HandSwipeDetector(config)
  }
  return instance
}

export const handSwipeDetector = new HandSwipeDetector()
