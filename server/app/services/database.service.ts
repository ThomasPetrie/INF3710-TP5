import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { EspeceOiseau } from "../../../common/tables/EspeceOiseau";

@injectable()
export class DatabaseService {
  // TODO: A MODIFIER POUR VOTRE BD
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "TP5",
    password: "4323jcmk",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true,
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  // ======= DEBUG =======
  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM ornithologue_bd.${tableName};`);
    client.release();
    return res;
  }

  // get hotels that correspond to certain caracteristics
  public async filterEspeces(
    nomscientifique: string,
    nomcommun: string,
    statut: string,
    predateur: string,
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (nomscientifique.length > 0) searchTerms.push(`nomscientifique = '${nomscientifique}'`);
    if (nomcommun.length > 0) searchTerms.push(`nomcommun = '${nomcommun}'`);
    if (statut.length > 0) searchTerms.push(`statut = '${statut}'`);
    if (predateur.length > 0) searchTerms.push(`predateur = '${predateur}'`);

    let queryText = "SELECT * FROM ornithologue_bd.especeoiseau";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }

  // ======= HOTEL =======
  public async createEspece(espece: EspeceOiseau): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!espece.nomscientifique || !espece.nomcommun || !espece.statutspeces)
      throw new Error("Invalid create species values");

    const values: (string | null)[] = [espece.nomscientifique, espece.nomcommun, espece.statutspeces, espece.nomscientifiquecomsommer];
    const queryText: string = `INSERT INTO ornithologue_bd.especeoiseau VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values as string[]);
    client.release();
    return res;
  }

  // modify name or city of a hotel
  public async updateEspece(espece: EspeceOiseau): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];

    if (espece.nomscientifique.length > 0) toUpdateValues.push(`nomscientifique = '${espece.nomscientifique}'`);
    if (espece.nomcommun && espece.nomcommun.length > 0) toUpdateValues.push(`nomcommun = '${espece.nomcommun}'`);
    if (espece.statutspeces && espece.statutspeces.length > 0) toUpdateValues.push(`statutspeces = '${espece.statutspeces}'`);
    if (espece.nomscientifiquecomsommer !== null) toUpdateValues.push(`nomscientifiquecomsommer = '${espece.nomscientifiquecomsommer}'`);
    if (espece.nomscientifiquecomsommer === 'null') toUpdateValues.push(`nomscientifiquecomsommer = NULL`);

    if (
      espece.nomscientifique.length === 0 ||
      espece.nomcommun.length === 0 ||
      espece.statutspeces.length === 0
    )
      throw new Error("Invalid species update query");

    const query = `UPDATE ornithologue_bd.especeoiseau SET ${toUpdateValues.join(
      ", "
    )} WHERE nomscientifique = '${espece.nomscientifique}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteEspece(nomscientifique: string): Promise<pg.QueryResult> {
    if (nomscientifique.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    const query = `DELETE FROM ornithologue_bd.especeoiseau WHERE nomscientifique = '${nomscientifique}';`;

    const res = await client.query(query);
    client.release();
    return res;
  }

}
