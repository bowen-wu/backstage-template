import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path: string }>(
  router: Route[] | undefined,
  pathname: string,
): T | undefined => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export const getDayStr = (daysFromToday: number, connector = '-') => {
  const discrepancyTimestamp = 24 * 3600 * 1000 * daysFromToday;
  const today = new Date();
  today.setTime(parseInt((today.getTime() + discrepancyTimestamp).toString(), 10));
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthStr = `${month <= 9 ? '0' : ''}${month}`;
  const dayStr = `${today.getDate() < 9 ? '0' : ''}${today.getDate()}`;
  return `${year}${connector}${monthStr}${connector}${dayStr}`;
};

export const getLastMonthStr = (connector = '-') => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthStr = `${month < 9 ? '0' : ''}${month}`;
  if (month === 0) {
    return `${year - 1}${connector}${12}`;
  }
  return `${year}${connector}${monthStr}`;
};

export const downloadImage = (imgsrc: string, name?: string) => {
  const image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(image, 0, 0, image.width, image.height);
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = name || 'picture';
    a.href = url;
    a.dispatchEvent(event);
  };
  image.src = imgsrc;
};

export const isShallowEqualForObject = (obj1: any, obj2: any): boolean => {
  // 注意：这个仅仅比较了对象中的 **自身可枚举属性**
  const obj1Type = typeof obj1;
  const obj2Type = typeof obj2;
  if (obj1Type !== 'object' || obj2Type !== 'object') {
    throw Error('传入的参数类型必须是对象！');
  }
  if (obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length === Object.keys(obj2).length) {
    return Object.keys(obj1).every((key: string) => {
      const value1 = obj1[key];
      const value2 = obj2[key];
      const value1Type = typeof value1;
      const value2Type = typeof value2;
      if (value1Type === value2Type) {
        switch (value1Type) {
          case 'function':
          case 'symbol':
          case 'bigint':
            return true;
          case 'undefined':
          case 'boolean':
          case 'number':
          case 'string':
            return value1 === value2;
          case 'object':
            // object + null
            if (value1 === null && value2 === null) {
              return true;
            }
            return isShallowEqualForObject(value1, value2);
          default:
            return false;
        }
      }
      return false;
    });
  }
  return false;
};

export const infoIsValid = (info: any): boolean => {
  // 注意：这个仅仅判断了对象中的 **自身可枚举属性** 是否有效
  if (typeof info !== 'object' && info === null) {
    throw Error('传入的参数类型必须是对象！');
  }
  return Object.values(info).every((value: any) => {
    switch (typeof value) {
      case 'function':
      case 'symbol':
      case 'bigint':
      case 'boolean':
      case 'number':
        return true;
      case 'undefined':
      case 'string':
        return Boolean(value);
      case 'object':
        // object + null
        if (value === null) {
          return false;
        }
        return infoIsValid(value);
      default:
        return false;
    }
  });
};
