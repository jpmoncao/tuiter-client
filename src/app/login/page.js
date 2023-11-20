'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from './page.module.css';

import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from "@/services/api";

const doLoginFormSchema = z.object({
    login: z.string()
        .nonempty('Insira um e-mail ou nome de usuário!'),
    password: z.string()
        .min(8, 'A senha deve ter no mínimo 8 dígitos!')
});

export default function Page() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(doLoginFormSchema)
    });

    const doLogin = async (data) => {
        try {
            const response = await api.post('/users/login', data);

            if (response.status === 201) {
                const token = response.data.token;
                localStorage.setItem('token', `Bearer ${token}`);

                router.push('/home');
            } else {
                console.error('Erro no login:', response.data);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <main className={styles.container}>
            <form
                onSubmit={handleSubmit(doLogin)}
                className={styles.form}
            >
                <aside className={styles.form__aside}>
                    <Image
                        src="/logo.svg"
                        width={40}
                        height={32}
                        alt="Picture of the author"
                    />
                    <h1 className={styles.form__title__mobile}>Fazer login</h1>
                </aside>

                <div className={styles.form__container}>
                    <h1 className={styles.form__title__desktop}>Fazer login</h1>

                    <div>
                        <input
                            type="text"
                            placeholder="E-mail ou nome de usuário"
                            className={styles.form__input}
                            {...register('login')}
                        />
                        {errors.login && <span className={styles.form__error}>{errors.login.message}</span>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Senha"
                            className={styles.form__input}
                            {...register('password')}
                        />
                        {errors.password && <span className={styles.form__error}>{errors.password.message}</span>}
                    </div>

                    <button className={styles.form__button}>Entrar</button>
                    <p className={styles.form__legend}> Não tem uma conta? <Link href="/criar" className={styles.form__legend__link}>Inscreva-se</Link></p>
                </div>
            </form>
        </main >
    )
}