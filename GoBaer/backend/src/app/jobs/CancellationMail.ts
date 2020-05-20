import Mail from '../../lib/Mail';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
class CancellationMail {
    get key(){
        return 'CancellationMail';
    }

    async handle({data}) {
        const {appointment} = data;
        await Mail.sendMail({
            to: `${appointment?.provider?.name} <${appointment?.provider?.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancelations',
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(
                    parseISO(appointment.date),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    {locale: ptBR}
                )
            }
        });
    }
}

export default new CancellationMail();