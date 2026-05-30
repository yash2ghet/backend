import { Request, Response, NextFunction } from "express";

function ab1(req: Request, res: Response, next: NextFunction) {
    const accept = req.headers["accept"] || "";
    if (!accept.includes("text/html")) {
        res.status(400).send("HTML responses are not supported");
        return;
    }
    console.log("This is function ab1");
    next();
}

function ab2(req: Request, res: Response, next: NextFunction) {
    console.log("This is function ab2")
    next();
}

const middleware1 = {ab1, ab2};

export default middleware1;