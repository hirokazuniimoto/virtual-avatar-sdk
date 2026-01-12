/**
 * テキストの文脈に応じて適切な表情タイプを判定する（簡易版）
 * 
 * OSS版では基本的な判定のみ提供
 */

export type ExpressionType = 'joy' | 'fun' | 'neutral'

/**
 * テキストから表情タイプを判定
 */
export function getExpressionTypeFromText(text: string): ExpressionType {
  const lowerText = text.toLowerCase()

  // 感謝・お礼系のキーワード
  const gratitudeKeywords = [
    'ありがとう',
    '感謝',
    'お礼',
    'ありがとうございます',
    'thank you',
    'thanks',
  ]

  // 提案・おすすめ系のキーワード
  const recommendationKeywords = [
    'おすすめ',
    'お勧め',
    '推奨',
    '人気',
    'best',
    'popular',
    '美味しい',
    'おいしい',
    'delicious',
    'tasty',
    'good',
  ]

  // 歓迎・挨拶系のキーワード
  const welcomeKeywords = [
    'いらっしゃいませ',
    'ようこそ',
    'welcome',
    'こんにちは',
    'おはよう',
    'こんばんは',
    'hello',
    'hi',
  ]

  // 会計・確認系のキーワード（無表情）
  const neutralKeywords = [
    '会計',
    'お会計',
    '支払い',
    'payment',
    'checkout',
    '確認',
    '合計',
    'total',
  ]

  // 無表情の判定（優先度が高い）
  if (neutralKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'neutral'
  }

  // 喜びの表情の判定
  if (
    gratitudeKeywords.some(keyword => lowerText.includes(keyword)) ||
    welcomeKeywords.some(keyword => lowerText.includes(keyword))
  ) {
    return 'joy'
  }

  // 楽しい表情の判定
  if (recommendationKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'fun'
  }

  // デフォルトは無表情
  return 'neutral'
}

