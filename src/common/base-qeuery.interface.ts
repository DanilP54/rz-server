export interface BaseQuery {
  segment?: 'instincts' | 'intellect' | 'balance';
  topic?: 'aesthetics' | 'self-expression' | 'live' | 'documentary' | 'series';
  page?: number;
  limit?: number;
}
