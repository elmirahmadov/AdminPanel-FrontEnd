export const urlRegex =
  /^(https?:\/\/)([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

export const isValidVersion = (version: string) => {
  const versionRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
  return versionRegex.test(version);
};
