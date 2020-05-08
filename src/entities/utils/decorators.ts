export const PasswordProtected = () => (prototype: any, propertyKey: string) => {
  Reflect.defineMetadata('passwordProtected', true, prototype, propertyKey);
};

export function isPasswordProtected<T>(TargetClass: new () => T, field: Exclude<keyof T, number>) {
  return Reflect.getMetadata('passwordProtected', new TargetClass(), field);
}
