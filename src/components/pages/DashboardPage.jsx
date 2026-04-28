import { Activity, Package, Truck, TrendingUp } from 'lucide-react';

export default function DashboardPage({ t }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('dashboard_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('dashboard_subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: t('stat_total_value'), value: '$245K', icon: TrendingUp, color: 'text-green-500' },
          { label: t('stat_total_products'), value: '1,240', icon: Package, color: 'text-blue-500' },
          { label: t('stat_low_stock'), value: '12', icon: Activity, color: 'text-red-500' },
          { label: t('stat_in_transit'), value: '8', icon: Truck, color: 'text-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-6 flex items-center justify-between transition-colors" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{stat.label}</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg`} style={{ backgroundColor: 'var(--panel-border)' }}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ color: 'var(--app-text)' }}>{t('stock_movement')}</h3>
            <select className="text-sm py-1 px-3 rounded border focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--muted)', border: '1px solid var(--panel-border)' }}>
              <option>{t('last_7_days')}</option>
              <option>{t('last_30_days')}</option>
            </select>
          </div>
          <div className="h-64 flex items-end space-x-2 sm:space-x-4">
            {[40, 70, 45, 90, 65, 85, 110].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-blue-600/20 group-hover:bg-blue-500 transition-colors rounded-t-sm" style={{ height: `${height}%` }}>
                  <div className="w-full h-1 bg-blue-500"></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  {t('day')} {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--app-text)' }}>{t('recent_activity')}</h3>
          <div className="space-y-6">
            {[
              { text: 'Restocked Aluminium 40x40', time: '2 mins ago', type: 'add' },
              { text: 'Order #892 dispatched', time: '1 hour ago', type: 'ship' },
              { text: 'Low stock alert: U-Channel', time: '3 hours ago', type: 'alert' },
              { text: 'New shipment received', time: '5 hours ago', type: 'add' },
            ].map((activity) => (
              <div key={`${activity.text}-${activity.time}`} className="flex items-start space-x-4">
                <div className={`mt-1 w-2 h-2 rounded-full ${activity.type === 'add' ? 'bg-green-500' : activity.type === 'ship' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{activity.text}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 rounded-lg text-sm font-medium" style={{ border: '1px solid var(--panel-border)', color: 'var(--muted)' }}>{t('view_all_activity')}</button>
        </div>
      </div>
    </div>
  );
}
