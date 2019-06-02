const getters = {
  // studio
  canvas: state => state.studio.canvas,
  activeObject: state => state.studio.activeObject,
  galleryTypes: state => state.studio.galleryTypes,
  gallerys: state => state.studio.gallerys,
  layers: state => state.studio.layers,
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
  diePatternId: state => state.home.diePattern.id,
  // 磨具
  diePatternPath: state => state.home.diePattern.path
}

export default getters
