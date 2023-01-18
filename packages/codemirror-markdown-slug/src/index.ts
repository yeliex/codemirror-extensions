import plugin from './plugin';
import style from './style';

export * from './command';
export { default as style } from './style';
export { default as plugin } from './plugin';

export default () => {
    return [plugin, style];
};
