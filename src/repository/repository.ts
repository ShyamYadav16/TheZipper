import { Repository as typeRepository } from 'typeorm';
import { unmanaged, injectable } from 'inversify';

export type Query<T> = {
  [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface Repository<T> {
  save(data: T): Promise<T>;
}

@injectable()
export abstract class GenericRepositoryImp<TEntity> implements Repository<TEntity> {

  private readonly repository: typeRepository<TEntity>;

  public constructor(@unmanaged() repository: typeRepository<TEntity>) {
    this.repository = repository;
  }

  public async save(data: any): Promise<TEntity> {
    const result = await this.repository.save(data);
    return result;
  }

}