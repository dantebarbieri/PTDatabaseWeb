import React from 'react'

export default function Checkbox() {
	const [checked, setChecked] = React.useState<boolean>(true);

  return (
    <label>
      <input type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      Check Me!
    </label>
  );
}
