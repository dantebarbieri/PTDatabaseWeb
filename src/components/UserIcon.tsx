import React from 'react'
import '../styles/UserIcon.scss'

export default function UserIcon(props:
	{ userIcon: string | null }
) {
	return (
		<div className="UserIcon">
				<div className="IconBorder">
					{props.userIcon
						?
						<img src={props.userIcon} alt="PFP" />
						:
						<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.watsonmartin.com%2Fwp-content%2Fuploads%2F2016%2F03%2Fdefault-profile-picture.jpg&f=1&nofb=1" alt="Default PFP" />
					}
				</div>
		</div>
	)
}
