export const FF_ZIP_UPLOADS = 'FF_ZIP_UPLOADS';
export const FF_DOCKER_RUNNER = 'FF_DOCKER_RUNNER';

let featureFlags = {
    FF_ZIP_UPLOADS: false,
    FF_DOCKER_RUNNER: true,
};

const FF_FLAGS = [FF_ZIP_UPLOADS];

export const isFeatureFlagEnabled = (flag: 'FF_ZIP_UPLOADS'|'FF_DOCKER_RUNNER'):boolean => {
    return featureFlags[flag];
};

export const hasFeatureFlag = (flag: string) => {
    return FF_FLAGS.includes(flag)
};
