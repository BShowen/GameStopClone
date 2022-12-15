// get request to list all consoles
exports.GET_consoleList = (req, res) => {
  res.send("Respond with a CONSOLE resource");
};

// get request for a single console
exports.GET_consoleView = (req, res) => {
  const id = req.params.consoleId;
  res.send(`Console ID: ${id}`);
};
