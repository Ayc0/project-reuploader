⚠️ THIS PROJECT ISN'T STABLE, ONLY TESTED ON 1 PACKAGE AND ONLY WORKS WITH NODE 15 (I think it does with node 14 too, but I'm not sure)

# Goal

The goal of this package is to ease the renaming of a package in NPM and to redeploy all previous versions in the new package.

By default, it'll get all the previous versions and re-deploy them.

To use it, you just have to:

```js
await renamePackage("old-name", "new-name");
```

## Additional infos

### OTP

If you need OTPs:

```js
await renamePackage("old-name", "new-name", { otp: "OTP" });
```

### Access

If you need to set `access:public` or `access:private`, you can do:

```js
await renamePackage("old-name", "new-name", { access: "ACCESS" });
```

### Versions

You can also use the field `versions` or `excluded` to either only use the specified versions, or to excluded specific versions:

```js
await renamePackage("old-name", "new-name", { versions: ["1.0.0"] });
await renamePackage("old-name", "new-name", { excluded: ["1.0.0-beta-1"] });
```
