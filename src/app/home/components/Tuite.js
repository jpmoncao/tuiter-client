import Image from 'next/image';

import styles from './tuites.module.css';

export default function Tuite({ profileimg, username, content, firstname, lastname, createdAt }) {
    return (
        <div className={styles.tuite__container}>
            <Image
                src={profileimg ? `profile/${profileimg}.png` : `profile.svg`}
                width={48}
                height={48}
                alt={`Picture of the ${username}`}
            />
            <div className={styles.tuite__text}>
                <p className={styles.tuite__header}>
                    <strong>{`${firstname} ${lastname}`}</strong>
                    @{username}
                    • {createdAt}
                </p>
                <p className={styles.tuite__content}>
                    {content}
                </p>
            </div>
        </div>
    );
}