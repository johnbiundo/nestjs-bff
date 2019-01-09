import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { AuthCheckContract } from './authcheck.contract';
import { OrgAuthCheck } from './org.authcheck';
import { ScopedData } from './scoped-authcheck.contract';
import { UserAuthCheck } from './user.authcheck';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck implements AuthCheckContract {
  private orgAuthCheck = new OrgAuthCheck();
  private userAuthCheck = new UserAuthCheck();

  public async isAuthorized(credentials: UserCredentialsContract | undefined | null, entity: IEntity): Promise<boolean> {
    const scopedData = new ScopedData();

    scopedData.userIdForTargetResource = entity['userId'];
    scopedData.orgIdForTargetResource = entity['orgId'];

    let result = scopedData.userIdForTargetResource ? await this.orgAuthCheck.isAuthorized(credentials, scopedData) : true;
    result = result && scopedData.orgIdForTargetResource ? await this.userAuthCheck.isAuthorized(credentials, scopedData) : true;

    return result;
  }
}
