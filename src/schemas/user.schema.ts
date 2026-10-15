import * as yup from 'yup'

const phoneRegex = /^\+?[\d\s()-]{9,20}$/

const baseUserSchema = {
    firstName: yup
        .string()
        .trim()
        .required("Введіть ім'я")
        .min(2, "Ім'я має містити щонайменше 2 символи")
        .max(50, "Ім'я не може бути довшим за 50 символів")
        .matches(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ' -]+$/, "Ім'я може містити лише літери, дефіс та пробіли"),

    lastName: yup
        .string()
        .trim()
        .required('Введіть прізвище')
        .min(2, 'Прізвище має містити щонайменше 2 символи')
        .max(50, 'Прізвище не може бути довшим за 50 символів')
        .matches(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ' -]+$/, 'Прізвище може містити лише літери, дефіс та пробіли'),

    email: yup
        .string()
        .trim()
        .required('Введіть email')
        .email('Введіть коректний email (наприклад, example@mail.com)'),

    username: yup
        .string()
        .trim()
        .required('Введіть username')
        .min(3, 'Username має містити щонайменше 3 символи')
        .max(30, 'Username не може бути довшим за 30 символів')
        .matches(/^[a-zA-Z0-9_.-]+$/, 'Username може містити лише латинські літери, цифри, підкреслення, крапку чи дефіс'),

    age: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === '' || originalValue === null ? undefined : value
        )
        .typeError('Вік має бути числом')
        .required('Введіть вік')
        .integer('Вік має бути цілим числом')
        .min(1, 'Вік має бути більшим за 0')
        .max(120, 'Вік не може перевищувати 120 років'),

    gender: yup
        .string()
        .required('Оберіть стать')
        .oneOf(['male', 'female'], 'Оберіть правильне значення для статі'),

    phone: yup
        .string()
        .trim()
        .required('Введіть номер телефону')
        .matches(
            phoneRegex,
            'Некоректний формат телефону. Приклад: +380971234567 або +1 555-555-5555'
        )
        .test('digits-count', 'Номер телефону має містити від 9 до 15 цифр', (value) => {
            if (!value) return false
            const digitsOnly = value.replace(/\D/g, '')
            return digitsOnly.length >= 9 && digitsOnly.length <= 15
        })
}

export const userCreateValidationSchema = yup.object({
    ...baseUserSchema,
    password: yup
        .string()
        .required('Введіть пароль')
        .min(6, 'Пароль має містити щонайменше 6 символів')
})

export const userEditValidationSchema = yup.object({
    ...baseUserSchema,
    password: yup
        .string()
        .notRequired()
        .test('min-length-if-present', 'Пароль має містити щонайменше 6 символів', (value) => {
            if (!value) return true
            return value.length >= 6
        })
})

export const userValidationSchema = userCreateValidationSchema