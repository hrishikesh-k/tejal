declare module '@netlify/cache-utils' {
  declare const restore : (path : string, options? : {
    cwd? : string
  }) => Promise<boolean>
  declare const save : (path : string, options? : {
    cwd? : string
    digests? : Array<string>
    ttl? : number
  }) => Promise<boolean>
}