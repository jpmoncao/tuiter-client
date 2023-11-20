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
    firstname: z.string('Nome inválido')
        .nonempty('Insira seu nome!'),
    lastname: z.string('Sobrenome inválido')
        .nonempty('Insira seu sobrenome!'),
    birthDate: z.string('Data inválida')
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

            if (users.length > 0)
                return users.find((user) => user.username !== username);

            return true;
        }, `O nome de usuário já está em uso!`),
    email: z.string('Email inválido')
        .email('Email inválido'),
    cellphone: z.string('Número de celular inválido'),
    password: z.string('')
        .min(8, 'A senha deve ter no mínimo 8 dígitos!')
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'A sua senha deve ser forte!'),
    confirm_password: z.string()
})
    .refine(fields => fields.password === fields.confirm_password, {
        path: ['confirm_password'],
        message: 'As senhas não coincidem!'
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
                router.push('/login');
            } else {
                console.error('Erro ao criar conta:', response.data.error);
            }
        } catch (error) {
            console.error('Erro ao criar conta:', error);
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

                    <div className={styles.form__fieldset}>
                        <div className={styles.form__field}>
                            <input
                                type="text"
                                placeholder="Nome*"
                                className={styles.form__input}
                                {...register('firstname')}
                            />
                            {errors.firstname && <span className={styles.form__error}>{errors.firstname.message}</span>}
                        </div>

                        <div className={styles.form__field}>
                            <input
                                type="text"
                                placeholder="Sobrenome*"
                                className={styles.form__input}
                                {...register('lastname')}
                            />
                            {errors.lastname && <span className={styles.form__error}>{errors.lastname.message}</span>}
                        </div>
                    </div>

                    <div className={styles.form__fieldset}>
                        <div className={styles.form__field}>
                            <input
                                type="text"
                                placeholder="Nome de usuário*"
                                className={styles.form__input}
                                {...register('username')}
                            />
                            {errors.username && <span className={styles.form__error}>{errors.username.message}</span>}
                        </div>

                        <div className={styles.form__field}>
                            <input
                                type="email"
                                placeholder="Email"
                                className={styles.form__input}
                                {...register('email')}
                            />
                            {errors.email && <span className={styles.form__error}>{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className={styles.form__fieldset}>
                        <div className={styles.form__field}>
                            <input
                                type="tel"
                                placeholder="Celular"
                                className={styles.form__input}
                                {...register('cellphone')}
                            />
                            {errors.cellphone && <span className={styles.form__error}>{errors.cellphone.message}</span>}
                        </div>

                        <div className={styles.form__field}>
                            <input
                                type="date"
                                placeholder=""
                                className={styles.form__input}
                                {...register('birthDate')}
                            />
                            {errors.birthDate && <span className={styles.form__error}>{errors.birthDate.message}</span>}
                        </div>
                    </div>

                    <div className={styles.form__fieldset}>
                        <div className={styles.form__field}>
                            <input
                                type="password"
                                placeholder="Senha*"
                                className={styles.form__input}
                                {...register('password')}
                            />
                            {errors.password && <span className={styles.form__error}>{errors.password.message}</span>}
                        </div>

                        <div className={styles.form__field}>
                            <input
                                type="password"
                                placeholder="Confirmar senha"
                                className={styles.form__input}
                                {...register('confirm_password')}
                            />
                            {errors.confirm_password && <span className={styles.form__error}>{errors.confirm_password.message}</span>}
                        </div>
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