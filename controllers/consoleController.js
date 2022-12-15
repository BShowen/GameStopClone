// get request to list all consoles
exports.GET_consoleList = (req, res) => {
  res.render("consoleList");
};

// get request for a single console
exports.GET_consoleView = (req, res) => {
  const id = req.params.consoleId;
  res.render("consoleView", {
    id,
  });
};
