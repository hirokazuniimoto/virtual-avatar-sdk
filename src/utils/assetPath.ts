/**
 * Asset path resolver utility
 * 
 * This utility helps resolve asset paths when using the package from npm.
 * When installed via npm, assets are located in node_modules/virtual-avatar/assets/
 */

let cachedBasePath: string | null = null

/**
 * Get the base path to the virtual-avatar package assets
 * This works in both browser and Node.js environments
 */
export function getAssetBasePath(): string {
  if (cachedBasePath) {
    return cachedBasePath
  }

  // Try to detect the package root from import.meta.url
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    try {
      const moduleUrl = new URL(import.meta.url)
      
      // For ESM builds, the path will be something like:
      // - http://localhost:3000/node_modules/virtual-avatar/dist/index.esm.js (dev server)
      // - file:///path/to/node_modules/virtual-avatar/dist/index.esm.js (file protocol)
      const pathParts = moduleUrl.pathname.split('/').filter(Boolean)
      
      // Try to find 'dist' and go up to package root
      const distIndex = pathParts.findIndex(part => part === 'dist')
      if (distIndex !== -1) {
        const packageRootParts = pathParts.slice(0, distIndex)
        const basePath = '/' + packageRootParts.join('/')
        cachedBasePath = basePath
        return basePath
      }
      
      // Try to find node_modules/virtual-avatar
      const nodeModulesIndex = pathParts.findIndex((part, i) => 
        part === 'node_modules' && pathParts[i + 1] === 'virtual-avatar'
      )
      if (nodeModulesIndex !== -1) {
        const packageRootParts = pathParts.slice(0, nodeModulesIndex + 2)
        const basePath = '/' + packageRootParts.join('/')
        cachedBasePath = basePath
        return basePath
      }
    } catch (e) {
      // Fall through to default
    }
  }
  
  // Default fallback: assume assets are accessible at /node_modules/virtual-avatar
  // This works with most dev servers (Vite, webpack dev server, etc.)
  // For production, users should copy assets to their public folder
  cachedBasePath = '/node_modules/virtual-avatar'
  return cachedBasePath
}

/**
 * Resolve an asset path relative to the package root
 * 
 * @param assetPath - Path relative to assets folder (e.g., 'animations/VRMA_01(全身を見せる).vrma')
 * @returns Full path to the asset
 * 
 * @example
 * ```typescript
 * import { getAssetPath } from 'virtual-avatar'
 * 
 * const animationPath = getAssetPath('animations/VRMA_01(全身を見せる).vrma')
 * await avatar.animate(animationPath)
 * ```
 */
export function getAssetPath(assetPath: string): string {
  const basePath = getAssetBasePath()
  // Remove leading slash from assetPath if present
  const cleanAssetPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  
  // If assetPath already starts with 'assets/', use it as is
  if (cleanAssetPath.startsWith('assets/')) {
    return `${basePath}/${cleanAssetPath}`
  }
  
  // Otherwise, prepend 'assets/'
  return `${basePath}/assets/${cleanAssetPath}`
}

/**
 * Resolve an animation path
 * Convenience function for animation files
 * 
 * @param animationName - Animation filename (e.g., 'VRMA_01(全身を見せる).vrma')
 * @returns Full path to the animation file
 * 
 * @example
 * ```typescript
 * import { getAnimationPath } from 'virtual-avatar'
 * 
 * await avatar.animate(getAnimationPath('VRMA_01(全身を見せる).vrma'))
 * ```
 */
export function getAnimationPath(animationName: string): string {
  return getAssetPath(`animations/${animationName}`)
}

/**
 * Resolve an avatar path
 * Convenience function for avatar files
 * 
 * @param avatarName - Avatar filename (e.g., 'AvatarSample_A.vrm')
 * @returns Full path to the avatar file
 * 
 * @example
 * ```typescript
 * import { getAvatarPath } from 'virtual-avatar'
 * 
 * const avatar = new AvatarSpeaker({
 *   avatar: getAvatarPath('AvatarSample_A.vrm')
 * })
 * ```
 */
export function getAvatarPath(avatarName: string): string {
  return getAssetPath(`avatars/${avatarName}`)
}

