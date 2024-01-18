export const _getUrl = () => {
  const urls = window.location.href.split(':')
  const url = urls[0] + ':' + urls[1] + ':' + urls[2].slice(0, 4)
  // console.log('url ==> ', url)
  // console.log('import.meta.url ==> ', import.meta.url)
  // console.log('import.meta.url ==> ', new URL('../../assets/img/Tempe.PNG',import.meta.url).href)
  return url
}