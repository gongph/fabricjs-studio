const getters = {
  // studio
  canvas: state => state.studio.canvas,
  activeObject: state => state.studio.activeObject,
  galleryTypes: state => state.studio.galleryTypes,
  gallerys: state => state.studio.gallerys,
  layers: state => state.studio.layers,
  fonts: state => state.studio.fonts,
  dieBg: state => state.studio.dieBg,
  waterText: state => state.studio.waterText,
  graphType: state => state.studio.graphType,
  fieldDisabled: state => state.studio.fieldDisabled,
  openPreviewCanvasDialog: state => state.studio.openPreviewCanvasDialog,
  tabActived: state => state.studio.tabActived,
  recevier: state => state.studio.recevier,
  taobaoId: state => state.studio.taobaoId,
  // user
  token: state => state.user.token,
  roles: state => state.user.roles,
  user: state => state.user.user,
  userId: state => state.user.user?.id,
  nickName: state => state.user.name,
  // home
  bookingList: state => state.home.bookingList,
  bookingTotal: state => state.home.bookingTotal,
  bookedList: state => state.home.bookedList,
  bookedTotal: state => state.home.bookedTotal,
  autoCompleteList: state => state.home.autoCompleteList,
  // 模具
  cacheDiePatternPath: state => state.home.cacheDiePattern.path,
  cacheCustomNumber: state => state.home.cacheDiePattern.customNumber,
  cacheModelType: state => state.home.cacheDiePattern.modelType,
  cacheSavedCustomTemplate: state => state.home.cacheDiePattern.savedCustomTemplate,
  sbdCustomTemplate: state => state.home.sbd,
  bjbCustomTemplate: state => state.home.bjb,
  taobaoNickname: state => state.home.customeTemplate.taobaoNickname,
  theRecipientName: state => state.home.customeTemplate.theRecipientName
}

export default getters
