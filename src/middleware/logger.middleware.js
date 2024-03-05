
import winston from 'winston';


const logger = winston.createLogger({
    level:'info',
    format:winston.format.json(),
    defaultMeta:{service:'request-logging'},
    transports:[
        new winston.transports.File({filename:'log.txt'}) 
    ]
});

const loggerMiddleware = async(req,res,next)=>{
    // 1.log request body.
    if(!req.url.includes('signin')){
        
        const logData = `${req.url}-${req.body.email}`;
        logger.info(logData);
    }
    next();
}
export default loggerMiddleware ;