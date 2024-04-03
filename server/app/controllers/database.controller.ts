import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";

import { EspeceOiseau } from '../../../common/tables/EspeceOiseau';

import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    router.get("/especeoiseau", (req: Request, res: Response, _: NextFunction) => {
      let nomscientifique = req.params.nomscientifique ? req.params.nomscientifique : "";
      let nomcommun = req.params.nomcommun ? req.params.nomcommun : "";
      let statut = req.params.statut ? req.params.statut : "";
      let predateur = req.params.predateur ? req.params.predateur : "";

      this.databaseService
        .filterEspeces(nomscientifique, nomcommun, statut, predateur)
        .then((result: pg.QueryResult) => {
          const especesOiseaux: EspeceOiseau[] = result.rows.map((espece: EspeceOiseau) => ({
            nomscientifique: espece.nomscientifique,
            nomcommun: espece.nomcommun,
            statutspeces: espece.statutspeces,
            nomscientifiquecomsommer: espece.nomscientifiquecomsommer,
          }));
          res.json(especesOiseaux);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.post(
      "/especeoiseau/insert",
      (req: Request, res: Response, _: NextFunction) => {
        const espece: EspeceOiseau = {
          nomcommun: req.body.nomcommun,
          nomscientifique: req.body.nomscientifique,
          statutspeces: req.body.statutspeces,
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer
        };

        this.databaseService
          .createEspece(espece)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.post(
      "/especeoiseau/delete/:nomscientifique",
      (req: Request, res: Response, _: NextFunction) => {
        const nomscientifique: string = req.params.nomscientifique;
        this.databaseService
          .deleteEspece(nomscientifique)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.put(
      "/especeoiseau/update",
      (req: Request, res: Response, _: NextFunction) => {
        const espece: EspeceOiseau = {
          nomcommun: req.body.nomcommun,
          nomscientifique: req.body.nomscientifique,
          statutspeces: req.body.statutspeces,
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer
        };

        this.databaseService
          .updateEspece(espece)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    // ======= GENERAL ROUTES =======
    router.get(
      "/tables/:tableName",
      (req: Request, res: Response, next: NextFunction) => {
        this.databaseService
          .getAllFromTable(req.params.tableName)
          .then((result: pg.QueryResult) => {
            res.json(result.rows);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    return router;
  }
}
