const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(404).end();
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MongoError") {
    return res.status(400).json({ error: error.message });
  } else {
    return res
      .status(500)
      .json({
        error: "Some error occured on our side. Please retry after some time",
      });
  }
};
export default errorHandler;
