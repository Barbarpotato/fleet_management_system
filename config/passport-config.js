import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialize = (passport) => {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username: username } });

            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }

            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: id } });
            done(null, user);
        } catch (e) {
            done(e);
        }
    });
};

export default initialize;
