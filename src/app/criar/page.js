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
    firstname: z.string()
        .nonempty('Insira seu nome!'),
    lastname: z.string()
        .nonempty('Insira seu sobrenome!'),
    birthDate: z.string()
        .nonempty('Insira a data de nascimento!')
        .refine((birthdate) => !(new Date().getFullYear() < new Date(birthdate).getFullYear()), 'Insira uma data válida!')
        .refine((birthdate) => (new Date().getFullYear() - new Date(birthdate).getFullYear() - 1) >= 16, 'Você precisa ter mais de 16 anos!'),
    username: z.string()
        .nonempty('Insira um nome de usuário!')
        .toLowerCase()
        .trim()
        .min(8, 'O nome do usuário deve ter no mínimo 8 dígitos!')
        .refine(username => username.trim().split(' ') == username, 'O nome de usuário não pode ter espaços!')
        .refine(async (username) => {
            const usernameWhere = username.substring(0, 7);
            const users = (await api.get(`/users/?substr=${usernameWhere}`)).data;
    
            if(users.length > 0)
                return users.find((user) => user.username !== username);

            return true;
        }, `O nome de usuário já está em uso!`),
    email: z.string()
        .email(),
    cellphone: z.number(),
    password: z.string()
        .min(8, 'A senha deve ter no mínimo 8 dígitos!')
});

export default function Page() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(doLoginFormSchema)
    });

    const createUser = async (data) => {
        try {
            const response = await api.post('/users/', data);

            if (response.status === 201) {
                const token = response.data.token;
                localStorage.setItem('token', `Bearer ${token}`);

                router.push('/');
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
                onSubmit={handleSubmit(createUser)}
                className={styles.form}
            >
                <div className={styles.form__container}>
                    <h1 className={styles.form__title}>Criar Conta</h1>

                    <div>
                        <input
                            type="text"
                            placeholder="Nome"
                            className={styles.form__input}
                            {...register('firstname')}
                        />
                        {errors.firstname && <span className={styles.form__error}>{errors.firstname.message}</span>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Sobrenome"
                            className={styles.form__input}
                            {...register('lastname')}
                        />
                        {errors.lastname && <span className={styles.form__error}>{errors.lastname.message}</span>}
                    </div>

                    <div>
                        {errors.username && <span className={styles.form__error}>{errors.username.message}</span>}
                        {!errors.username && <span className={styles.form__sucess}>Nome de usuário válido</span>}
                        <input
                            type="text"
                            placeholder="Nome de usuário"
                            className={styles.form__input}
                            {...register('username')}
                        />
                    </div>

                    <div>
                        <input
                            type="date"
                            placeholder="Data de nascimento"
                            className={styles.form__input}
                            {...register('birthDate')}
                        />
                        {errors.birthDate && <span className={styles.form__error}>{errors.birthDate.message}</span>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className={styles.form__input}
                            {...register('email')}
                        />
                        {errors.email && <span className={styles.form__error}>{errors.email.message}</span>}
                    </div>

                    <div>
                        <input
                            type="tel"
                            placeholder="Celular"
                            className={styles.form__input}
                            {...register('cellphone')}
                        />
                        {errors.cellphone && <span className={styles.form__error}>{errors.cellphone.message}</span>}
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
                <aside className={styles.form__aside}>
                    <Image
                        src="/logo.svg"
                        width={40}
                        height={32}
                        alt="Picture of the author"
                    />
                </aside>
            </form>
        </main >
    )
}