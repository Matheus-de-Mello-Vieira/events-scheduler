const isTest = process.env.NODE_ENV === "test";

const requireProcessEnv = (name) => {
  if (!process.env[name] && !isTest) {
    throw new Error("You must set the environment variable:" + name);
  }
  return process.env[name];
};

const region = requireProcessEnv("AWS_REGION");

const config = {
  all: {
    env: requireProcessEnv("NODE_ENV"),
    region,
  },
  development: {},
  production: {},
};

if (!isTest) {
  AWS.config.update({ region });
}

export default { ...config.all, ...config[config.all.env] };
