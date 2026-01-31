export class CategoryCreatedEvent {
  constructor(public readonly category: any) { }
}

export class CategoryUpdatedEvent {
  constructor(public readonly category: any) { }
}

export class CategoryDeletedEvent {
  constructor(public readonly categoryId: string) { }
}