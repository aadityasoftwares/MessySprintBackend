import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes.js';
import userRoutes from '../modules/user/routes/user.routes.js';
import userProfileRoutes from '../modules/userprofile/routes/userProfile.routes.js';
import userPreferenceRoutes from '../modules/userpreference/routes/userPreference.routes.js';
import roleRoutes from '../modules/roles/routes/role.routes.js';
import permissionRoutes from '../modules/permissions/routes/permission.routes.js';
import planRoutes from '../modules/plan/routes/plan.routes.js';
import planPriceRoutes from '../modules/planprice/routes/planPrice.routes.js';
import featureRoutes from '../modules/feature/routes/feature.routes.js';
import planFeatureRoutes from '../modules/planfeature/routes/planfeature.routes.js';
import userSubscriptionRoutes from '../modules/usersubscription/routes/usersubscription.routes.js';
import subscriptionPaymentRoutes from '../modules/subscriptionpayment/routes/subscriptionpayment.routes.js';
import subscriptionUsageRoutes from '../modules/subscriptionusage/routes/subscriptionusage.routes.js';
import currencyRoutes from '../modules/currency/routes/currency.routes.js';
import systemSettingRoutes from '../modules/systemsettings/routes/systemSetting.routes.js';
import auditLogRoutes from '../modules/auditlog/routes/auditLog.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/userprofile', userProfileRoutes);
router.use('/userpreference', userPreferenceRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/plans/prices', planPriceRoutes);
router.use('/plans', planRoutes);
router.use('/features', featureRoutes);
router.use('/planfeatures', planFeatureRoutes);
router.use('/usersubscription', userSubscriptionRoutes);
router.use('/subscriptionpayment', subscriptionPaymentRoutes);
router.use('/subscriptionusage', subscriptionUsageRoutes);
router.use('/currencies', currencyRoutes);
router.use('/systemsettings', systemSettingRoutes);
router.use('/auditlogs', auditLogRoutes);

export default router;
