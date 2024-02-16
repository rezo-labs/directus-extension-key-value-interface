export type Type = 'string' | 'integer' | 'float' | 'boolean' | 'list' | 'json' | 'unknown';

export interface SchemaField {
  key: string;
  type: Type;
  interface: string;
  note: string;
  options: Record<string, any> | null;
}
