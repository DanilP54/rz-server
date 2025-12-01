export interface MovieBrowsePayload {
  mediaUrl: string
}

export type Payload = MovieBrowsePayload

export interface IPayloadStrategy {
  build(alias: string): string
}

export class MoviePayloadStrategy implements IPayloadStrategy {
  build(alias: string): string {
    return `json_build_object('mediaUrl', ${alias}.slug)`
  }
}
