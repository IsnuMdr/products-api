export class ProductCreatedEvent {
  constructor(public readonly product: any) { }
}

export class ProductUpdatedEvent {
  constructor(public readonly product: any) { }
}

export class ProductDeletedEvent {
  constructor(public readonly productId: string) { }
}