class Site < ActiveRecord::Base
  
  has_many :users

  def self.get_all
    Site.all.order('name').map { |site| site.obj }
  end

  def account_count
    self.users.where(account_status: 'active').length
  end

  def accounts_available?
    ( account_count < self.max_accounts )
  end

  def obj
    { 
      id: self.id,
      name: name,
      account_count: account_count,
      max_accounts: self.max_accounts
    }
  end
  
end