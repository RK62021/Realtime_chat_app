// helps to handle error and eliminate try catch blocks in async functions
const asynchandler = fn => (req,res,next) => {

    Promise
    .resolve(fn(req,res,next)) // Ensure the function is resolved as a Promise
    .catch(next); // Pass any errors to the next middleware (error handler)
}

module.exports = asynchandler;
