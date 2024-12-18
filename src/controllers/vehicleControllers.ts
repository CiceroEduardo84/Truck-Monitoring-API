import { NextFunction, Request, Response } from "express";
import { vehicleSchema } from "../validations/vehicleSchema";
import { vehicleService } from "../services/vehicleService";
import { VehicleRepository } from "../repositories/vehicleRepository";
import { UUIDSchema } from "../validations/UUIDSchema";
import { vehiclePaginationSchema } from "../validations/vehiclePaginationSchema";

export const vehicleControllers = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { plate, type, nameDriver, status } = vehicleSchema.parse(req.body);
      const { id } = UUIDSchema("user").parse({ id: req.userID });

      const vehicleCreated = await vehicleService.create(
        { plate, type, nameDriver, status, id_user: id },
        VehicleRepository
      );

      return res
        .status(201)
        .json({ message: "Vehicle created!", vehicleCreated });
    } catch (error) {
      return next(error);
    }
  },
  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset, filter } = vehiclePaginationSchema.parse(
        req.query
      );

      const vehicles = await vehicleService.read(
        {
          limit,
          offset,
          filter,
        },
        VehicleRepository
      );

      return res.status(200).json({ vehicles });
    } catch (error) {
      return next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.userID;
      const { id } = UUIDSchema("vehicle").parse(req.params);
      const { nameDriver, plate, type, status } = vehicleSchema.parse(req.body);

      const vehicleUpdated = await vehicleService.update(
        { id_vehicle: id, nameDriver, plate, type, status, id_user: idUser },
        VehicleRepository
      );

      res.status(200).json({ message: "Vehicle updated!", vehicleUpdated });
    } catch (error) {
      return next(error);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = UUIDSchema("vehicle").parse(req.params);

      const vehicleData = await vehicleService.delete(id, VehicleRepository);

      return res.status(200).json({ message: "Vehicle deleted!", vehicleData });
    } catch (error) {
      return next(error);
    }
  },
};
