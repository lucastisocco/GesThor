export interface Repository<T> {
  findAll(): Promise<T[] | undefined>;
  findOne(item: { id: number }): T | undefined;
  add(item: T): T | undefined;
  update(item: T): T | undefined;
  delete(item: { id: number }): T | undefined;
}