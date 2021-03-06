import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import AppError from "@shared/errors/AppErros";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createdAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {

    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentsRepository();
        fakeNotificationRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createdAppointment = new CreateAppointmentService(fakeAppointmentRepository, fakeNotificationRepository, fakeCacheProvider);
    });

    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date,'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createdAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: '123123123',
            user_id: '1231231234',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123123');
    });

    it('should not be able to create a new appointment on the same time', async () => {

        jest.spyOn(Date,'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12, 0, 0, 0).getTime();
        });

        const date = new Date(2020, 4, 10, 12, 0, 0, 0);

        await createdAppointment.execute({
            date: date,
            provider_id: '123123123',
            user_id: '1231231234',
            
        });

        await expect(createdAppointment.execute({
            date: date,
            provider_id: '123123123',
            user_id: '1231231234',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be able to create an appointment on a past date', async () => {

        jest.spyOn(Date,'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createdAppointment.execute({
            date: new Date(2020, 4, 10, 11),
            provider_id: '123123123',
            user_id: '1231231234',
        })).rejects.toBeInstanceOf(AppError);


    });

    it('should not be able to create an appointment with same user as provider', async () => {

        jest.spyOn(Date,'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createdAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: '123123123',
            user_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);


    });


    it('should not be able to create an appointment before 8am and after 5pm', async () => {

        jest.spyOn(Date,'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createdAppointment.execute({
            date: new Date(2020, 4, 11, 7),
            provider_id: '123123123',
            user_id: '1231231234',
        })).rejects.toBeInstanceOf(AppError);

        await expect(createdAppointment.execute({
            date: new Date(2020, 4, 11, 18),
            provider_id: '123123123',
            user_id: '1231231234',
        })).rejects.toBeInstanceOf(AppError);

    });

});