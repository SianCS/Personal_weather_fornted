import useUserStore from "../stores/userStore"

function Users() {

  const user = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logout)
  return (
    <div>
      <button onClick={logout} className="btn">Logout</button>
    </div>
  )
}
export default Users