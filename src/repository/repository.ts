import { Repository as typeRepository } from 'typeorm';
import { unmanaged, injectable } from 'inversify';

export interface Repository<T> {
  save(data: T): Promise<T>;
}

/**
 * This is a Generic repository class which helps to save and get entities
 */
@injectable()
export abstract class GenericRepositoryImp<TEntity> implements Repository<TEntity> {

  private readonly repository: typeRepository<TEntity>;

  public constructor(@unmanaged() repository: typeRepository<TEntity>) {
    this.repository = repository;
  }

  /**
   * This method receives a generic entity and saves that to db
   * @param data
   * @returns {Promise<TEntity>}
   */
  public async save(data: any): Promise<TEntity> {
    const result = await this.repository.save(data);
    return result;
  }

  /**
   *This method receives where conditions and gets the entity.
   * @param where
   * @returns {Promise<TEntity[]>}
   */
  public async findManyUsingWhere(where: any): Promise<TEntity[]> {
    return await this.repository.find({ where });
  }

}