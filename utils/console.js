require("colors");
exports.consoleMessage = (initialtext, any = "(～￣▽￣)～ You are the best!".green) => {
  console.log("\n\n\n" + "-".repeat(60).rainbow);
  console.log(
    initialtext.yellow,
    "typeof: ".blue,
    typeof any === "object"
      ? any instanceof Array
        ? "Array"
        : "Object"
      : typeof any
  );
  console.log("-".repeat(60).rainbow);
  console.log(any); //(～￣▽￣)～
  console.log("-".repeat(30).rainbow, "\n\n\n");
};

exports.consoleError = (error) => {
  console.log("\n" + "-".repeat(60).red);
  console.error("There are an error:".red);
  console.log("-".repeat(60).red);
  console.error(error);
  console.log("-".repeat(30).red, "\n\n\n");
};
