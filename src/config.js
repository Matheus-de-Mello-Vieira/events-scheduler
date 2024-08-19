import AWS from "aws-sdk";

const requireProcessEnv = (name) => {
  if (!process.env[name] && process.env.NODE_ENV !== "test") {
    throw new Error("Você deve definir a variável de ambiente:" + name);
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

AWS.config.update({ region });

export default { ...config.all, ...config[config.all.env] };
