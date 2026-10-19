import avatar from '../assets/avatar.jpg'
import './PrisonerProfile.css'

export function PrisonerProfile() {
  return (
    <div className="prisoner-profile" role="group" aria-label="Профиль заключённого">
      <div className="prisoner-profile__avatar-frame">
        <img
          className="prisoner-profile__avatar"
          src={avatar}
          alt="Аватар Skinodro4ep"
          width={184}
          height={184}
          decoding="async"
        />
      </div>
      <div className="prisoner-profile__identity">
        <h3 className="prisoner-profile__nickname">Skinodro4ep</h3>
        <p className="prisoner-profile__meta">
          <span className="prisoner-profile__case">ДЕЛО № 001</span>
          <span className="prisoner-profile__status">
            <span className="prisoner-profile__signal" aria-hidden="true" />
            ОТБЫВАЕТ НАКАЗАНИЕ
          </span>
        </p>
      </div>
    </div>
  )
}
